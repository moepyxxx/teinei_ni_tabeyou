class CreateMenus < ActiveRecord::Migration[7.2]
  def change
    create_table :menus do |t|
      t.date :date
      t.integer :section
      t.bigint :user_id, null: false

      t.timestamps
    end

    add_foreign_key :menus, :users, column: :user_id, on_delete: :cascade
    add_index :menus, [ :date, :section, :user_id ], unique: true, name: "unique_date_section_user_id"
  end
end
