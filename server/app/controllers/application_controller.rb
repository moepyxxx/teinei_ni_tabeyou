class ApplicationController < ActionController::API
  before_action :authenticated_user
  include ActionController::Cookies

  private

  def current_user
    @current_user ||= User.find_by(id: session[:user_id])
  end

  def authenticated_user
    render json: { error: "Not Authorized" }, status: :unauthorized unless current_user
  end
end
