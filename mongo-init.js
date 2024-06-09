db.createUser({
    user: "category",
    pwd: "category",
    roles: [
        {
            role: "readWrite",
            db: "category"
        }
    ]
});

db.createCollection("category");
