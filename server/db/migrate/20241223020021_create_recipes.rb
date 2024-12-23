class CreateRecipes < ActiveRecord::Migration[7.2]
  def change
    create_table :recipes do |t|
      t.string :title, null: false
      t.string :source_url
      t.string :source_memo
      t.string :memo

      t.bigint :user_id, null: false

      t.timestamps
    end

    add_foreign_key :recipes, :users, column: :user_id, on_delete: :cascade
  end
end
