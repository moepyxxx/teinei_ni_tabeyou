class RecipesController < ApplicationController
  def show
    @recipe = Recipe.includes(:materials).find(params[:id])

    render json: @recipe.to_json(include: :materials)
  end
end
