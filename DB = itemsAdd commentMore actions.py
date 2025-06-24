DB = itemsAdd commentMore actions

DB = user:
user_id = str
name
password (hashed)
items


users/{user_id}/items/ -> post
users/{user_id}/items/{item_id}/ -> get/delete/put

users/{user_id}/ -> get/put/delete
/users/ -> post