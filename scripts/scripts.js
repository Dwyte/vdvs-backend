$(() => {
    $('#ballot-div').on('click', '#ballot-submit-button', () => {
        event.preventDefault();
        
        const voterInfo = {
            lrn: parseInt($('#info-form :input[name= lrn]').val()),
            fullName: $('#info-form :input[name= fullName]').val().replace(/\s/g, '').toLowerCase(),
            gradeLevel: parseInt($('#info-form :input[name= gradeLevel]').val()),
            section: $('#info-form :input[name= section]').val().replace(/\s/g, '').toLowerCase()
        }

        //console.log(`LRN: ${lrn} Full Name: ${fullName} Grade ${gradeLevel} Section ${section}`);

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
});