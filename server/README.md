# README

## Database

```mermaid

	User{
		bigint ID PK
		string email
		string password
	}

	Material{
		bigint ID PK
		string item
		string amount
		bigint recipe_id FK
		bigint user_id FK
	}

	Recipe{
		bigint ID PK
		string title
		string source_url
		string source_memo
		string memo
		bigint user_id FK
	}

	Menu{
		bigint ID PK
		date date
		bigint user_id FK
	}

	MenuRecipe{
			bigint ID PK
			bigint menu_id FK
			bigint recipe_id FK
			bigint user_id FK
	}

	 Recipe ||--o{ Material: ""
	 Menu ||--o{ MenuRecipe: ""
	 Recipe ||--o{ MenuRecipe: ""

```
