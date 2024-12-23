class MenuRecipe < ApplicationRecord
  belongs_to :recipe
  belongs_to :menu
  belongs_to :user
end
