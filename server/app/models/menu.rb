class Menu < ApplicationRecord
  belongs_to :user

  enum section: {
    morning: 0,
    lunch: 1,
    dinner: 2
  }
end
