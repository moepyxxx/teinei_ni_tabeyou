class Material < ApplicationRecord
  belongs_to :user
  belongs_to :recipe

  validates :item, presence: true
  validates :item, length: { maximum: 50 }
  validates :amount, length: { maximum: 50 }
end
