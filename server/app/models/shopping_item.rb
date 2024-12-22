class ShoppingItem < ApplicationRecord
  validates :item, presence: true
  validates :item, length: { maximum: 50 }
  validate :cannot_update_when_checked, on: :update

  def cannot_update_when_checked
    if checked
      errors.add(:checked, "cannot be true for update")
    end
  end
end
