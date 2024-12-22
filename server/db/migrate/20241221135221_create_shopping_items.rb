class CreateShoppingItems < ActiveRecord::Migration[7.2]
  def change
    create_table :shopping_items do |t|
      t.string :item, null: false
      t.boolean :checked, null: false
      t.string :last_checked_at

      t.timestamps
    end
  end
end
