from django.views.generic import TemplateView


class SignatureGenerationView(TemplateView):
    template_name = 'tools/signature_gen.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['ariane'] = [
            {
                'target': '#',
                'label': "Signature ECN"
            }
        ]
        return context
