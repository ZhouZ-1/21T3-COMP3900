from flask import request, send_file
from flask_restplus import Resource, abort
from app import api, db
from util.models import image_upload_model, success_model
from util.helpers import save_image

images = api.namespace('images', description='Image access and modification')

@images.route('/<path>', doc={
    "description": "Retrieves and updates images that are stored in the backend."
})
@images.doc(params={'path': 'The path of the image you want to retrieve.'})
class ImagesGet(Resource):
    def get(self, path):
        return send_file(f"images/{path}", mimetype='image/jpg')

@images.route('/', doc={
    "description": "Uploads the profile picture of the user to the backend."
})
class ImagesPut(Resource):
    @images.expect(image_upload_model)
    @images.response(200, "Success", success_model)
    @images.response(400, "Invalid image data")
    @images.response(401, "Invalid token")
    def put(self):
        body = request.json
        token = body['token']
        base64 = body['base64']

        # Check that the user exists
        user = db.get_user_by_value("active_token", token)
        if not user or token == "":
            abort(401, "Invalid token")

        # Save image to disk.
        url = f"{user['username']}.jpg"
        try:
            save_image(base64, url)
        except:
            abort(400, "Invalid image data")

        # Update the user's profile image url
        db.update_user_by_value(user["username"], "profile_image", url)

        return {
            "is_success": True
        }
