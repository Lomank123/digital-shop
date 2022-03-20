from django.test import TestCase
from mainapp.models import CustomUser


class TestCustomUserManager(TestCase):

    def setUp(self):
        pass

    def test_create_user(self):
        self.assertEqual(CustomUser.objects.filter(is_superuser=False).count(), 0)
        CustomUser.objects.create_user(email="test1@gmail.com", username="test1", password="12345")
        self.assertEqual(CustomUser.objects.filter(is_superuser=False).count(), 1)

    def test_create_superuser(self):
        self.assertEqual(CustomUser.objects.filter(is_superuser=True).count(), 0)
        CustomUser.objects.create_superuser(
            email="superuser@gmail.com",
            username="super",
            password="12345"
        )
        self.assertEqual(CustomUser.objects.filter(is_superuser=True).count(), 1)

        try:
            CustomUser.objects.create_superuser(
                email="superuser2@gmail.com",
                username="super2",
                password="12345",
                is_staff=False
            )
        except Exception as error:
            self.assertEqual(str(error), "Superuser must have is_staff=True.")
        try:
            CustomUser.objects.create_superuser(
                email="superuser3@gmail.com",
                username="super3",
                password="12345",
                is_superuser=False
            )
        except Exception as error:
            self.assertEqual(str(error), "Superuser must have is_superuser=True.")
