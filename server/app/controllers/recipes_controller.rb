class RecipesController < ApplicationController
  def show
    @recipe = Recipe.includes(:materials).find(params[:id])

    render json: @recipe.to_json(include: :materials)
  end

  def create
    ActiveRecord::Base.transaction do
      begin

      @recipe = Recipe.new(recipe_params.except(:materials))
      @recipe.user_id = current_user.id

      @recipe.save!
      recipe_params[:materials].each do |material_params|
        @recipe.materials.create!(material_params.merge(user_id: current_user.id))
      end

      head :ok

      rescue ActiveRecord::RecordInvalid => e
        render json: { error: e.message }, status: :unprocessable_entity
      end
    end
  end

  def update
    ActiveRecord::Base.transaction do
      begin

      # 更新
      @recipe = Recipe.find(params[:id]) # 既存のレコードを取得
      @recipe.update!(recipe_params.except(:materials).merge(user_id: current_user.id))

      # 小テーブルのDelete Insert
      Material.where(recipe_id: params[:id]).destroy_all

      recipe_params[:materials].each do |material_params|
        @recipe.materials.create!(material_params.merge(user_id: current_user.id))
      end

      head :ok

      rescue ActiveRecord::RecordInvalid => e
        render json: { error: e.message }, status: :unprocessable_entity
      end
    end
  end

  def destroy
    @recipe = Recipe.find(params[:id])

    if @recipe.destroy
      head :ok
    else
      render json: { error: "Failed to delete the item. Reason: #{@recipe.errors.full_messages}" }, status: :unprocessable_entity
    end
  end

  private

  def recipe_params
    params.require(:recipe).permit(:title, :source_url, :source_memo, :memo, materials: [ :item, :amount ])
  end
end
