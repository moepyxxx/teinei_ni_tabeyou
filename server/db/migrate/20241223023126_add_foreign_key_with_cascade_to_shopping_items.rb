class AddForeignKeyWithCascadeToShoppingItems < ActiveRecord::Migration[7.2]
  def change
    add_foreign_key :shopping_items, :users, column: :user_id, on_delete: :cascade
  end
end
