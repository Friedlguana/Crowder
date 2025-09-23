import firebase_admin
from firebase_admin import credentials, firestore
cred = credentials.Certificate("C:\\soma\\desktop\\devjams\\Crowder\\backend\\app\\crowder-e26dc-firebase-adminsdk-fbsvc-111b4a2222.json")

firebase_admin.initialize_app(cred)
db = firestore.client()

doc_ref, _ = db.collection("test").add({"kaka": "rao"})
print(doc_ref.id)
