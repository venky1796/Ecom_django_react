from django.db.models.signals import pre_save,post_save
from django.contrib.auth.models import User



def updaetUser(sender, instance, **kwargs):
    user = instance

    if user.email != '':
        user.username = user.email


pre_save.connect(updaetUser,sender=User)