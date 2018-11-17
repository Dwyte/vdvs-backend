$(() => {
    $('#ballot-div').on('click', '#ballot-submit-button', () => {
        event.preventDefault();
        
        const voterInfo = {
            lrn: parseInt($('#info-form :input[name= lrn]').val()),
            fullName: $('#info-form :input[name= fullName]').val().replace(/\s/g, '').toLowerCase(),
            gradeLevel: parseInt($('#info-form :input[name= gradeLevel]').val()),
            section: $('#info-form :input[name= section]').val().replace(/\s/g, '').toLowerCase()
        }

        var voterVotes = $('#vote-form :input:checked').map(function(){return $(this).val();}).get();

        $.ajax({
            url: '/vote/' + voterInfo.lrn,
            contentType: 'application/json',
            method: 'PUT',
            data: JSON.stringify({info:voterInfo,votes: voterVotes}),
            success: (response) => {
                console.log(response);
            }
        })
    });

    $('#nominate-form').on('click', '#nominate-candidate', () => {
        event.preventDefault();
        
        const position = $('#nominate-form :input[name=position]').val();
        const candidate = $('#nominate-form :input[name=candidatename]').val();
        const quantity = $('#nominate-form :input[name=quantity]').val();

        $.ajax({
            url: '/admin/' + position,
            contentType: 'application/json',
            method: 'PUT',
            data: JSON.stringify({position: position, candidate:candidate, quantity: parseInt(quantity)}),
            success: (response) => {
                console.log(response);
            }
        })
    })
});