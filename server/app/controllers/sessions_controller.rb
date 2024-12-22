class SessionsController < ApplicationController
  skip_before_action :authenticated_user, only: [ :create ]

  def create
    if current_user
      render json: { error: "Already LoggedIn" }, status: :unprocessable_entity
      return
    end

    user = User.find_by(email: params[:email])

    if user && user.authenticate(params[:password])
      session[:user_id] = user.id
      render json: user, status: :ok
    else
      render json: { error: "Invalid Email or Password" }, status: :unauthorized
    end
  end

  def destroy
    session[:user_id] = nil
    head :ok
  end
end
