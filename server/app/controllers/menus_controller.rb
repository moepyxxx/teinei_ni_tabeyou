class MenusController < ApplicationController
  def show
    date = Date.parse(params[:date])
    menus = Menu.includes(menu_recipes: :recipe).where(date: date)

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
    # impl
  end

  def update
    # impl
  end

  def destroy
    # impl
  end
end
