class Recipe < ApplicationRecord
  belongs_to :user
  has_many :materials, dependent: :destroy
  has_many :menu_recipes, dependent: :destroy

  validates :title, presence: true
  validates :source_url, length: { maximum: 100 }
  validates :source_memo, length: { maximum: 100 }
  validates :memo, length: { maximum: 500 }
end
