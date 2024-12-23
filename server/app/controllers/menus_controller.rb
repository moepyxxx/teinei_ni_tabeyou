class MenusController < ApplicationController
  def show
    date = Date.parse(params[:date])
    menus = Menu.includes(menu_recipes: :recipe).where(date: date)

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
          title: menu_recipe.recipe.title
        }
      end || [],
      lunch: lunch&.menu_recipes&.map do |menu_recipe|
        {
          id: menu_recipe.recipe.id,
          title: menu_recipe.recipe.title
        }
      end || [],
      morning: morning&.menu_recipes&.map do |menu_recipe|
        {
          id: menu_recipe.recipe.id,
          title: menu_recipe.recipe.title
        }
      end || []
    }
  end

  def create
    date = Date.parse(params[:date])

    menus = Menu.where(date: date, user_id: current_user.id)
    p "--------"
    p current_user.id
    p "--------"
    p menus
    p "--------"
    p menus.present?
    p "--------"

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
    # impl
  end

  def destroy
    # impl
  end

  def menu_params
    params.require(:menu).permit(
      dinner: [],
      morning: [],
      lunch: []
    )
  end
end
