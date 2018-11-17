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

    // Admin
    $('#nominate-form').on('click', '#nominate-candidate', () => {

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

    $('#election-dashboard').on('click', '.update-candidate-name', () => {
        const rowEl = $('.update-candidate-name').closest('tr');
        const candidateID = rowEl.find('.id').text();
        const candidatePosition = rowEl.find('.position').text();
        const newName = rowEl.find('.name').val();
        
        console.log(`candidateid: ${candidateID} candidatePosition: ${candidatePosition} newName: ${newName}`);

        $.ajax({
            url: '/admin/update/' + candidateID,
            contentType: 'application/json',
            method: 'PUT',
            data: JSON.stringify({position: candidatePosition, newName: newName}),
            success: (response) => {
                console.log(response);
                //location.reload();
            }
        })
    });

    $('#election-dashboard').on('click', '.remove-candidate', () => {
        const rowEl = $('.remove-candidate').closest('tr');
        const candidateID = rowEl.find('.id').text();
        const candidatePosition = rowEl.find('.position').text();
        
        console.log(`candidateid: ${candidateID} candidatePosition: ${candidatePosition}`);

        $.ajax({
            url: '/admin/remove/' + candidateID,
            contentType: 'application/json',
            method: 'DELETE',
            data: JSON.stringify({position: candidatePosition}),
            success: (response) => {
                console.log(response);
                //location.reload();
            }
        })
    });


});