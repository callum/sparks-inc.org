#!/bin/bash
set -e
npm run build
aws s3 sync public/ $AWS_S3_BUCKET --delete --acl public-read \
  --exclude '*.html' \
  --exclude 'favicon.ico' \
  --exclude 'robots.txt' \
  --cache-control 'max-age=31536000'
aws s3 sync public/ $AWS_S3_BUCKET --delete --acl public-read \
  --exclude '*' \
  --include '*.html' \
  --include 'favicon.ico' \
  --include 'robots.txt' \
  --cache-control 'no-cache'
aws cloudfront create-invalidation --distribution-id $AWS_CLOUDFRONT_DISTRIBUTION_ID --paths '/*'
