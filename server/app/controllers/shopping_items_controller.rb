class ShoppingItemsController < ApplicationController
  include ActionController::MimeResponds
  before_action :set_shopping_item, only: [ :update, :destroy ]
  before_action :check_different_user, only: [ :update, :destroy ]

  def show
    set_shopping_item

    render json: @shopping_item
  end

  def index
    @shopping_items = ShoppingItem.all

    respond_to do |format|
      format.json { render json: @shopping_items }
    end
  end

  def create
    @shopping_item = ShoppingItem.new(shopping_item_params)
    @shopping_item.user_id = current_user.id

    if @shopping_item.save
      head :ok
    else
      render json: { error: "Failed to create the item. Reason: #{@shopping_item.errors.full_messages}" }, status: :unprocessable_entity
    end
  end

  def update
    set_shopping_item
    check_different_user

    if @shopping_item.update(shopping_item_params)
      head :ok
    else
      render json: { error: "Failed to update the item. Reason: #{@shopping_item.errors.full_messages}" }, status: :unprocessable_entity
    end
  end

  def destroy
    set_shopping_item
    check_different_user

    if @shopping_item.user_id != current_user.id
      render json: { error: "Cannot Delete Different User Shopping Item" }, status: :unprocessable_entity
      return
    end

    if @shopping_item.destroy
      head :ok
    else
      render json: { error: "Failed to delete the item. Reason: #{@shopping_item.errors.full_messages}" }, status: :unprocessable_entity
    end
  end

  private
    def shopping_item_params
      params.require(:shopping_item).permit(:item, :checked)
    end

    def set_shopping_item
      @shopping_item = ShoppingItem.find(params[:id])
    end

    def check_different_user
      render json: { error: "Cannot Act Different User Shopping Item" }, status: :unprocessable_entity unless @shopping_item.user_id == current_user.id
    end
end
