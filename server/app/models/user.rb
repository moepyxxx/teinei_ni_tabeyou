class User < ApplicationRecord
  has_many :recipe, dependent: :destroy

  has_secure_password

  validates :email, presence: true, uniqueness: true
  validates :password, presence: true
end
