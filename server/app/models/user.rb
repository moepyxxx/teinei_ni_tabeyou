class User < ApplicationRecord
  has_many :recipes, dependent: :destroy
  has_many :shopping_items, dependent: :destroy
  has_many :materials, dependent: :destroy
  has_many :menus, dependent: :destroy

  has_secure_password

  validates :email, presence: true, uniqueness: true
  validates :password, presence: true
end
