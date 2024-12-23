class Menu < ApplicationRecord
  belongs_to :user
  has_many :menu_recipes, dependent: :destroy

  enum section: {
    morning: 0,
    lunch: 1,
    dinner: 2
  }
end
