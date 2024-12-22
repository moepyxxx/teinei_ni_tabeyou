class ShoppingItem < ApplicationRecord
  validates :item, presence: true
  validates :item, length: { maximum: 50 }
  validate :cannot_update_when_checked, on: :update

  def cannot_update_when_checked
    if checked && item_changed?
      old_item = item_before_last_save
      new_item = item

      if old_item != new_item
        errors.add(:item, "cannot be changed when checked is true")
      end
    end
  end
end
