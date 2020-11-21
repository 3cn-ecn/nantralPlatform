from django.views.generic import TemplateView


class SignatureGenerationView(TemplateView):
    template_name = 'services/signature_gen.html'
