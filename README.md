# Forum App Api

## Technologies
Javascript with Hapi framework, PostgreSQL, Jest


## Installation

```
npm install
```
After that, create database in your local computer:
```
CREATE DATABASE forumapi;
CREATE DATABASE forumapi_test;
```
Then create your .env file based on .env.example

Finally, migrate models to your database
```
npm run migrate up
npm run migrate:test up
```

## Run

```
npm run start
```

## Test

```
npm run test
```
## API Reference

### Movies API
#### Create thread

```
  POST /threads
```

| Payload | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `title`      | `string` | *Required* |
| `body`      | `string` | *Required* |



#### Get thread detail

```
  GET /threads/${threadId}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `threadId`      | `string` | *Required* |


#### Add comment

```
  POST /threads/${threadId}/comments
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `threadId`      | `string` | *Required* |

| Payload | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `content`      | `string` | *Required* |

#### Delete comment

```
  DELETE /threads/${threadId}/comments/{commentId}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `threadId`      | `number` | *Required* |
| `commentId`      | `number` | *Required* |

#### Like and Unlike comment

```
  PUT /threads/${threadId}/comments/${commentId}/likes
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `threadId`      | `string` | *Required* |
| `commentId`      | `string` | *Required* |

#### Add comment reply

```
  POST /threads/${threadId}/comments/${commentId}/replies
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `threadId`      | `string` | *Required* |
| `commentId`      | `string` | *Required* |

| Payload | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `content`      | `string` | *Required* |

#### Delete comment reply

```
  DELETE /threads/${threadId}/comments/${commentId}/replies/${replyId}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `threadId`      | `string` | *Required* |
| `commentId`      | `string` | *Required* |
| `replyId`      | `string` | *Required* |
