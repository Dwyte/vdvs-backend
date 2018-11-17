$(() => {
    $('#login-form').on('click', '#register-button', () => {
        event.preventDefault();
        const lrn = $('#lrn-input').val();
        const pass = $('#pass-input').val();

        $.ajax({
            url: '/login/' + lrn,
            contentType: 'application/json',
            data: JSON.stringify({ newName: newName }),
            success: (response) => {
                console.log(response);
            }
        });
    });

    $('#vote-form').on('click', '#vote-submit-button', () => {
        event.preventDefault();

        var values = $('#vote-form :input:checked').map(function(){return $(this).val();}).get();

        console.log(values[values.length - 1]);

        $.ajax({
            url: '/vote/s',
            contentType: 'application/json',
            method: 'PUT',
            data: JSON.stringify({data: values}),
            success: (response) => {
                console.log(response);
            }
        })
    })
})