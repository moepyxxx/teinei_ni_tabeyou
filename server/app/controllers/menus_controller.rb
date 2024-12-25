class MenusController < ApplicationController
  def index
    unless params[:from].present? && params[:to].present?
      render json: { error: "Both 'from' and 'to' parameters are required." }, status: :unprocessable_entity
      return
    end

    from = parse_date_safe params[:from]
    to = parse_date_safe params[:to]

    if from.nil? || to.nil?
      render json: { error: "Invalid date format. Please use YYYYMMDD." }, status: :unprocessable_entity
      return
    end

    menus = Menu.includes(menu_recipes: :recipe).where(date: from..to, user_id: current_user.id)

    result = []

    (from..to).each do |date|
      filtered_menus = menus.filter { |menu| menu.date == date.to_date }

      if filtered_menus.blank?
        result << {
          date: date,
          lunch: [],
          dinner: [],
          morning: []
        }
        next
      end

      dinner = filtered_menus.select { |item| item[:section] == "dinner" }.presence&.first
      lunch = filtered_menus.select { |item| item[:section] == "lunch" }.presence&.first
      morning = filtered_menus.select { |item| item[:section] == "morning" }.presence&.first

      result << {
        date: date,
        dinner: dinner&.menu_recipes&.map do |menu_recipe|
          {
            id: menu_recipe.recipe.id,
            title: menu_recipe.recipe.title,
            source_url: menu_recipe.recipe.source_url
          }
        end || [],
        lunch: lunch&.menu_recipes&.map do |menu_recipe|
          {
            id: menu_recipe.recipe.id,
            title: menu_recipe.recipe.title,
            source_url: menu_recipe.recipe.source_url
          }
        end || [],
        morning: morning&.menu_recipes&.map do |menu_recipe|
          {
            id: menu_recipe.recipe.id,
            title: menu_recipe.recipe.title,
            source_url: menu_recipe.recipe.source_url
          }
        end || []
      }
    end

    render json: result
  end

  def show
    date = parse_date_safe params[:date]
    menus = Menu.includes(menu_recipes: :recipe).where(date: date, user_id: current_user.id)

    if menus.blank?
      render json: {
        dinner: nil,
        lunch: nil,
        morning: nil
      }
      return
    end

    dinner = menus.select { |item| item[:section] == "dinner" }.presence&.first
    lunch = menus.select { |item| item[:section] == "lunch" }.presence&.first
    morning = menus.select { |item| item[:section] == "morning" }.presence&.first

    render json: {
      dinner: dinner&.menu_recipes&.map do |menu_recipe|
        {
          id: menu_recipe.recipe.id,
          title: menu_recipe.recipe.title,
          source_url: menu_recipe.recipe.source_url
        }
      end || [],
      lunch: lunch&.menu_recipes&.map do |menu_recipe|
        {
          id: menu_recipe.recipe.id,
          title: menu_recipe.recipe.title,
          source_url: menu_recipe.recipe.source_url
        }
      end || [],
      morning: morning&.menu_recipes&.map do |menu_recipe|
        {
          id: menu_recipe.recipe.id,
          title: menu_recipe.recipe.title,
          source_url: menu_recipe.recipe.source_url
        }
      end || []
    }
  end

  def create
    date = parse_date_safe params[:date]

    menus = Menu.where(date: date, user_id: current_user.id)
    if menus.present?
      render json: { error: "Already Created" }, status: :unprocessable_entity
      return
    end


    ActiveRecord::Base.transaction do
      begin
        dinner = Menu.create!(date: date, section: "dinner", user_id: current_user.id)
        menu_params[:dinner].each do |recipe_id|
          MenuRecipe.create!(
            menu_id: dinner.id,
            recipe_id: recipe_id,
            user_id: current_user.id,
          )
        end

        lunch = Menu.create!(date: date, section: "lunch", user_id: current_user.id)
        menu_params[:lunch].each do |recipe_id|
          MenuRecipe.create!(
            menu_id: lunch.id,
            recipe_id: recipe_id,
            user_id: current_user.id,
          )
        end

        morning = Menu.create!(date: date, section: "morning", user_id: current_user.id)
        menu_params[:morning].each do |recipe_id|
          MenuRecipe.create!(
            menu_id: morning.id,
            recipe_id: recipe_id,
            user_id: current_user.id,
          )
        end

        head :ok

      rescue ActiveRecord::RecordInvalid => e
        render json: { error: e.message }, status: :unprocessable_entity
      end
    end
  end

  def update
    date = parse_date_safe params[:date]
    menus = Menu.where(date: date, user: current_user.id)
    menu_ids = menus.map { |menu| menu.id }

    if menus.blank?
      dinner = Menu.create!(date: date, section: "dinner", user_id: current_user.id)
      menu_ids << dinner.id
      menus << dinner
      morning = Menu.create!(date: date, section: "morning", user_id: current_user.id)
      menu_ids << morning.id
      menus << morning
      lunch = Menu.create!(date: date, section: "lunch", user_id: current_user.id)
      menu_ids << lunch.id
      menus << lunch
    end

    ActiveRecord::Base.transaction do
      MenuRecipe.where(menu_id: menu_ids, user_id: current_user.id).destroy_all

      begin
        lunch_id = menus.find { |menu| menu.section == "lunch" }.id
        menu_params[:lunch]&.each do |recipe_id|
          MenuRecipe.create!(
            menu_id: lunch_id,
            recipe_id: recipe_id,
            user_id: current_user.id,
          )
        end

        dinner_id = menus.find { |menu| menu.section == "dinner" }.id
        menu_params[:dinner]&.each do |recipe_id|
          MenuRecipe.create!(
            menu_id: dinner_id,
            recipe_id: recipe_id,
            user_id: current_user.id,
          )
        end

        morning_id = menus.find { |menu| menu.section == "morning" }.id
        menu_params[:morning]&.each do |recipe_id|
          MenuRecipe.create!(
            menu_id: morning_id,
            recipe_id: recipe_id,
            user_id: current_user.id,
          )
        end

        head :ok

      rescue ActiveRecord::RecordInvalid => e
        render json: { error: e.message }, status: :unprocessable_entity
      end
    end
  end

  def menu_params
    params.permit(
      dinner: [],
      morning: [],
      lunch: []
    )
  end

  private
    def parse_date_safe(date_str)
      Date.parse(date_str)
    rescue ArgumentError
      nil
    end
end
