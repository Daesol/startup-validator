ALTER TABLE public.vc_validation_analyses ADD CONSTRAINT vc_validation_analyses_validation_form_id_fkey FOREIGN KEY (validation_form_id) REFERENCES public.validation_forms(id) ON DELETE CASCADE;
