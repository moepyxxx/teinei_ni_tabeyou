class CreateMenuRecipes < ActiveRecord::Migration[7.2]
  def change
    create_table :menu_recipes do |t|
      t.bigint :recipe_id
      t.bigint :menu_id
      t.bigint :user_id

      t.timestamps
    end

    add_foreign_key :menu_recipes, :users, column: :user_id, on_delete: :cascade
    add_foreign_key :menu_recipes, :recipes, column: :recipe_id, on_delete: :cascade
    add_foreign_key :menu_recipes, :menus, column: :menu_id, on_delete: :cascade
    add_index :menu_recipes, [ :recipe_id, :user_id, :menu_id ], unique: true, name: "unique_recipe_id_menu_id_user_id"
  end
end
