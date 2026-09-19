import base64, re
from email.utils import parsedate_to_datetime
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from ..config import settings
from .security import decrypt

def creds(user):
    return Credentials(token=None, refresh_token=decrypt(user.gmail_refresh_token), token_uri="https://oauth2.googleapis.com/token", client_id=settings.google_client_id, client_secret=settings.google_client_secret, scopes=["https://www.googleapis.com/auth/gmail.readonly","https://www.googleapis.com/auth/gmail.send"])

def service(user): return build("gmail","v1",credentials=creds(user),cache_discovery=False)
def header(headers,name): return next((h["value"] for h in headers if h["name"].lower()==name.lower()),"")
def text_from_payload(payload):
    data=payload.get("body",{}).get("data")
    if data: return base64.urlsafe_b64decode(data).decode(errors="ignore")
    for p in payload.get("parts",[]):
        if p.get("mimeType")=="text/plain":
            d=p.get("body",{}).get("data")
            if d: return base64.urlsafe_b64decode(d).decode(errors="ignore")
    return re.sub('<[^>]+>',' ',payload.get("snippet", ""))

def list_messages(user, limit=40):
    return service(user).users().messages().list(userId="me",maxResults=limit,labelIds=["INBOX"]).execute().get("messages",[])

def get_message(user,gid):
    return service(user).users().messages().get(userId="me",id=gid,format="full").execute()

def send_reply(user, to, subject, body, thread_id=None, message_id=None):
    import email.mime.text, email.mime.base
    from email.mime.multipart import MIMEMultipart
    msg=MIMEMultipart(); msg["To"]=to; msg["Subject"]=subject if subject.lower().startswith("re:") else "Re: "+subject
    if message_id: msg["In-Reply-To"]=message_id; msg["References"]=message_id
    msg.attach(email.mime.text.MIMEText(body,"plain","utf-8"))
    raw=base64.urlsafe_b64encode(msg.as_bytes()).decode()
    body_req={"raw":raw}
    if thread_id: body_req["threadId"]=thread_id
    return service(user).users().messages().send(userId="me",body=body_req).execute()
