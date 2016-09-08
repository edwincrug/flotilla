registrationModule.factory("Utils", function($http) {
    return {
        b64toBlob: function(b64Data, contentType, sliceSize, data) {
            contentType = contentType || '';
            sliceSize = sliceSize || 512;
            if (!data)
                var byteCharacters = atob(b64Data);
            else
                var byteCharacters = b64Data
            var byteArrays = [];

            for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                var slice = byteCharacters.slice(offset, offset + sliceSize);

                var byteNumbers = new Array(slice.length);
                for (var i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }

                var byteArray = new Uint8Array(byteNumbers);

                byteArrays.push(byteArray);
            }

            var blob = new Blob(byteArrays, {
                type: contentType
            });
            return blob;
        }
    }
});