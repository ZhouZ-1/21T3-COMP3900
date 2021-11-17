import { useEffect, useState } from 'react';
import api from '../../api';

function ImportModal(props) {
  const { trigger } = props;
  const token = sessionStorage.getItem('token');
  const [portfolioName, setPortfolioName] = useState('');
  useEffect(() => {
    setPortfolioName('');
    document.getElementById('portfolioInput').value = '';
  }, [trigger]);
  const processFile = async () => {
    var theFile = document.getElementById('myFile');
    let csv_string = '';
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
    //check if file is CSV
    if (regex.test(theFile.value.toLowerCase())) {
      //check if browser support FileReader
      if (typeof FileReader != 'undefined') {
        var myReader = new FileReader();
        myReader.onload = async function (e) {
          var content = myReader.result;
          var lines = content.split('\n');
          for (var count = 0; count < lines.length - 1; count++) {
            var rowContent = lines[count].split(',');
            let data = '';
            for (var i = 0; i < rowContent.length; i++) {
              if (i == rowContent.length - 1) {
                data = data.concat(rowContent[i].trim());
              } else {
                data = data.concat(rowContent[i].trim());
                data = data.concat(',');
              }
            }

            if (count == lines.length - 2) {
              csv_string = csv_string.concat(data);
            } else {
              csv_string = csv_string.concat(data);
              csv_string = csv_string.concat('\n');
            }
          }
          await api('portfolio/upload', 'POST', {
            token: token,
            csv_string: csv_string,
            portfolio_name: portfolioName,
          });
        };
        myReader.readAsText(theFile.files[0]);
      } else {
        alert('This browser does not support HTML5.');
      }
    } else {
      alert('Please upload a valid CSV file.');
    }
  };

  return (
    <div
      class='modal fade'
      id='importModal'
      tabindex='-1'
      role='dialog'
      aria-labelledby='importModalLabel'
      aria-hidden='true'
    >
      <div class='modal-dialog' role='document'>
        <div class='modal-content'>
          <div class='modal-header'>
            <h5 class='modal-title' id='exampleModalLabel'>
              Import portfolio with new name
            </h5>
            <button
              type='button'
              class='close'
              data-bs-dismiss='modal'
              aria-label='Close'
            >
              <span aria-hidden='true'>&times;</span>
            </button>
          </div>
          <div class='modal-body'>
            <div>
              <input type='file' id='myFile' />
              <table id='myTable'></table>
            </div>
            <div class='input-group input-group-sm mb-3'>
              <div class='input-group-prepend'>
                <span class='input-group-text' id='inputGroup-sizing-sm'>
                  Import it as:
                </span>
              </div>
              <input
                id='portfolioInput'
                type='text'
                class='form-control'
                aria-label='Small'
                aria-describedby='inputGroup-sizing-sm'
                onChange={(e) => setPortfolioName(e.target.value)}
              />
            </div>
          </div>
          <div class='modal-footer'>
            <button
              type='button'
              class='btn btn-secondary'
              data-dismiss='modal'
            >
              Close
            </button>
            <button
              type='button'
              class='btn btn-primary'
              data-bs-dismiss='modal'
              onClick={processFile}
            >
              Import
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ImportModal;
