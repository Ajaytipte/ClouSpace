# API Gateway Routes

| Path | Method | Description |
|------|--------|-------------|
| `/CloudSpacePermanentDelete` | ANY | |
| `/delete-file` | POST | Move file to trash |
| `/download-url` | GET | Generate pre-signed URL for download |
| `/files` | GET | List files for user |
| `/permanent-delete` | POST | Permanently delete file from S3 and DB |
| `/restore-file` | POST | Restore file from trash |
| `/storage-usage` | GET | Get storage usage statistics |
| `/upload-url` | POST | Generate pre-signed URL for upload |
