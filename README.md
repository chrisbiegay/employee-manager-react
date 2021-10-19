# Description
This is an example of a React web app with a Node.js back end which provides CRUD operations on an Employee entity.
Created using [Next.js](https://nextjs.org/).

Technologies demonstrated:
* React
* Next.js
* ...

# Prerequisites
* Node.js v12.22.7 

# Project Creation
These steps were used to create the project.
```
nvm use lts/erbium
npx create-next-app@latest
cd employee-manager
yarn add couchbase
```

# Run Couchbase
1. Start Couchbase via docker:
    ```
    docker run -d --name couchbase-employees \
      -p 8091-8096:8091-8096 -p 11210-11211:11210-11211 \
      -v ~/.docker-volumes/couchbase-empoyees:/opt/couchbase/var couchbase
    ```
2. After a few seconds open the Admin UI at http://localhost:8091.
3. Create a new cluster named **employees**, along with an admin user and password.
4. Create a bucket named **employees**. Under **Advanced bucket settings** uncheck **Replicas/Enable**.
5. Create a user with username **employees-app** and give it access to the **employees** bucket.

To stop and start Couchbase:
```
docker stop couchbase-employees
docker start couchbase-employees
```

# Run the App via the Dev Server
```
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

