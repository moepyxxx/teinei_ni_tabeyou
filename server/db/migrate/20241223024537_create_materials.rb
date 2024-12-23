class CreateMaterials < ActiveRecord::Migration[7.2]
  def change
    create_table :materials do |t|
      t.string :item, null: false
      t.string :amount
      t.bigint :user_id, null: false
      t.bigint :recipe_id, null: false

      t.timestamps
    end

    add_foreign_key :materials, :users, column: :user_id, on_delete: :cascade
    add_foreign_key :materials, :recipes, column: :recipe_id, on_delete: :cascade
  end
end
