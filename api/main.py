import os
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import boto3
from botocore.config import Config
from dotenv import load_dotenv

# Load environment variables from local development paths or production environments
parent_env = os.path.join(os.path.dirname(__file__), "..", ".env")
if os.path.exists(parent_env):
    load_dotenv(parent_env)
else:
    load_dotenv()

app = FastAPI(
    title="Baithak Backend S3/R2 Pipeline API",
    version="1.0.0",
    description="MNC-grade FastAPI secure serverless backend designed to manage presigned Cloudflare R2 upload pipelines."
)

# CORS configuration
origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "https://baithak-web-app.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Extract and validate Cloudflare R2 credentials
ACCOUNT_ID = os.getenv("CLOUDFLARE_ACCOUNT_ID")
ACCESS_KEY_ID = os.getenv("CLOUDFLARE_R2_ACCESS_KEY_ID")
SECRET_ACCESS_KEY = os.getenv("CLOUDFLARE_R2_SECRET_ACCESS_KEY")
BUCKET_NAME = os.getenv("CLOUDFLARE_R2_BUCKET_NAME", "baithak-media")
R2_PUBLIC_URL = os.getenv("VITE_R2_PUBLIC_URL", f"https://pub-{ACCOUNT_ID}.r2.dev")

if not all([ACCOUNT_ID, ACCESS_KEY_ID, SECRET_ACCESS_KEY]):
    print("Warning: Cloudflare R2 storage credentials are missing in backend configuration.")

# Configure S3 client pointing to Cloudflare R2 endpoint
try:
    s3_client = boto3.client(
        "s3",
        endpoint_url=f"https://{ACCOUNT_ID}.r2.cloudflarestorage.com",
        aws_access_key_id=ACCESS_KEY_ID,
        aws_secret_access_key=SECRET_ACCESS_KEY,
        config=Config(signature_version="s3v4"),
        region_name="auto"
    )
except Exception as e:
    print(f"Error initializing R2 client connection: {e}")
    s3_client = None


@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "Baithak FastAPI Backend",
        "r2_storage": "configured" if s3_client else "missing_credentials"
    }


@app.get("/api/v1/storage/presigned-url")
def get_presigned_url(
    filename: str = Query(..., description="Unique filename/key to store the asset"),
    content_type: str = Query(..., description="MIME content type of the file")
):
    """
    Exposes an S3-compatible pre-signed upload pipeline endpoint.
    Generates a secure, short-lived (1-hour expiry) pre-signed PUT URL for uploading media directly to Cloudflare R2.
    """
    if not s3_client:
        raise HTTPException(
            status_code=500,
            detail="Cloudflare R2 pipeline storage service is unconfigured on the server."
        )

    try:
        # Generate short-lived pre-signed PUT URL
        presigned_url = s3_client.generate_presigned_url(
            ClientMethod="put_object",
            Params={
                "Bucket": BUCKET_NAME,
                "Key": filename,
                "ContentType": content_type
            },
            ExpiresIn=3600  # 1 hour short-lived session
        )

        # Construct final public asset URL
        public_url = f"{R2_PUBLIC_URL.rstrip('/')}/{filename.lstrip('/')}"

        return {
            "presigned_url": presigned_url,
            "public_url": public_url,
            "filename": filename
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate pre-signed upload URL: {str(e)}"
        )
