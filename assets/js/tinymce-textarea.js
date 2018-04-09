
//            tinymce.init({
//                selector: "textarea",
//                plugins: "link image"
//            });

tinymce.init({
    selector: '.tinymce-textarea',
    height: 250,
    theme: 'modern',
    paste_data_images: true,
    plugins: [
        'advlist autolink lists link image charmap print preview hr anchor pagebreak',
        'searchreplace wordcount visualblocks visualchars code fullscreen',
        'insertdatetime media nonbreaking save table contextmenu directionality',
        'emoticons template paste textcolor colorpicker textpattern imagetools codesample toc help'
    ],
    toolbar1: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
    toolbar2: 'print preview media | forecolor backcolor emoticons | codesample help',
    image_advtab: true,
    file_picker_callback: function (callback, value, meta) {
        if (meta.filetype == 'image') {
            $('#upload').trigger('click');
            $('#upload').on('change', function () {
                var file = this.files[0];
                var reader = new FileReader();
                reader.onload = function (e) {
                    callback(e.target.result, {
                        alt: ''
                    });
                };
                reader.readAsDataURL(file);
            });
        }
    },
    templates: [
        {title: 'Lesson Plan', content: '<h1>Concept</h1><p>Example concept here</p>'},
        {title: 'Test template 2', content: 'Test 2'}
    ],
    content_css: [
        '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i'
//                    '//www.tinymce.com/css/codepen.min.css'
    ]
});
