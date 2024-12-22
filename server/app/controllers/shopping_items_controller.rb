class ShoppingItemsController < ApplicationController
  include ActionController::MimeResponds

  def show
    @shopping_item = ShoppingItem.find(params[:id])

    respond_to do |format|
      format.json { render json: @shopping_item }
    end
  end

  def index
    @shopping_items = ShoppingItem.all

    respond_to do |format|
      format.json { render json: @shopping_items }
    end
  end

  def update
    @shopping_item = ShoppingItem.find(params[:id])
    if @shopping_item.update(shopping_item_params)
      head :ok
    else
      render json: { error: 'Failed to update the item' }, status: :unprocessable_entity
    end
  end

  def create
    @shopping_item = ShoppingItem.new(shopping_item_params)
    if @shopping_item.save
      head :ok
    else
      render json: { error: 'Failed to create the item' }, status: :unprocessable_entity
    end
  end

  def destroy
    @shopping_item = ShoppingItem.find(params[:id])
    if @shopping_item.destroy
      head :ok
    else
      render json: { error: 'Failed to delete the item' }, status: :unprocessable_entity
    end      
  end

  private
    def shopping_item_params
      params.require(:shopping_item).permit(:item, :checked)
    end

end
