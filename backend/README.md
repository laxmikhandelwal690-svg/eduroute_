# EDUROUTE Go API

The backend is a Go HTTP service using MySQL, JWT, and bcrypt. It preserves the existing frontend API contract on port `5000`.

## Local run

```powershell
$env:MYSQL_PASSWORD = "eduroute_dev_password"
go run .
```

Supported configuration includes `PORT`, `MYSQL_URL` or `MYSQL_HOST`/`MYSQL_PORT`/`MYSQL_USER`/`MYSQL_PASSWORD`/`MYSQL_DATABASE`, `JWT_SECRET`, `CORS_ORIGIN`, and `ADMIN_SECRET`.

Set `SEED_DATA=true` for one startup to reset and load the sample catalog data, then restart normally.

## Checks

```powershell
go test ./...
go vet ./...
```
