# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.2].define(version: 2024_12_23_100606) do
  create_table "materials", charset: "utf8mb3", force: :cascade do |t|
    t.string "item", null: false
    t.string "amount"
    t.bigint "user_id", null: false
    t.bigint "recipe_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["recipe_id"], name: "fk_rails_474e19a40e"
    t.index ["user_id"], name: "fk_rails_cf58c42728"
  end

  create_table "menu_recipes", charset: "utf8mb3", force: :cascade do |t|
    t.bigint "recipe_id"
    t.bigint "menu_id"
    t.bigint "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["menu_id"], name: "fk_rails_e1d703b133"
    t.index ["recipe_id", "user_id", "menu_id"], name: "unique_recipe_id_menu_id_user_id", unique: true
    t.index ["user_id"], name: "fk_rails_64fa5c08b3"
  end

  create_table "menus", charset: "utf8mb3", force: :cascade do |t|
    t.date "date"
    t.integer "section"
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["date", "section", "user_id"], name: "unique_date_section_user_id", unique: true
    t.index ["user_id"], name: "fk_rails_c38eb0f938"
  end

  create_table "recipes", charset: "utf8mb3", force: :cascade do |t|
    t.string "title", null: false
    t.string "source_url"
    t.string "source_memo"
    t.string "memo"
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "fk_rails_9606fce865"
  end

  create_table "shopping_items", charset: "utf8mb3", force: :cascade do |t|
    t.string "item", null: false
    t.boolean "checked", null: false
    t.string "last_checked_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["user_id"], name: "index_shopping_items_on_user_id"
  end

  create_table "users", charset: "utf8mb3", force: :cascade do |t|
    t.string "email", null: false
    t.string "password_digest", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "materials", "recipes", on_delete: :cascade
  add_foreign_key "materials", "users", on_delete: :cascade
  add_foreign_key "menu_recipes", "menus", on_delete: :cascade
  add_foreign_key "menu_recipes", "recipes", on_delete: :cascade
  add_foreign_key "menu_recipes", "users", on_delete: :cascade
  add_foreign_key "menus", "users", on_delete: :cascade
  add_foreign_key "recipes", "users", on_delete: :cascade
  add_foreign_key "shopping_items", "users", on_delete: :cascade
end
