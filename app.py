import numpy as np
from sklearn import preprocessing
from flask import Flask, request, jsonify, render_template
import pickle
#export FLASK_ENV=development
#flask run
app = Flask(__name__)
model = pickle.load(open('model.pkl', 'rb'))
model2 = pickle.load(open('model5.pkl', 'rb'))
model3 = pickle.load(open('model3.pkl', 'rb'))
model4 = pickle.load(open('model4.pkl', 'rb'))

@app.route('/fertilizer')
def home():
    return render_template('form.html')
@app.route('/irrigation')
def home2():
    return render_template('form2.html')
@app.route('/production')
def home3():
    return render_template('form3.html')
@app.route('/crop')
def home4():
    return render_template('form4.html')

@app.route('/fertilizer',methods=['POST'])

def predict():
    '''
    For rendering results on HTML GUI
    '''
    int_features = [float(x) for x in request.form.values()]
    nm=preprocessing.scale(int_features)
    final_features = [np.array(nm)]
    prediction = model.predict(final_features)
    #print(x)

    output = prediction[0]

    return render_template('form.html', prediction_text='Amount of Fertilizer should be used is  {} kg per hectare'.format(output))
@app.route('/irrigation',methods=['POST'])
def predict2():
    '''
    For rendering results on HTML GUI
    '''
    int_features = [float(x) for x in request.form.values()]
    nm=preprocessing.scale(int_features)
    final_features = [np.array(nm)]
    
    prediction = model2.predict(final_features)
    #print(x)

    output = prediction[0]

    return render_template('form2.html', prediction_text2='Amount of irrigation water required is {} litres per week'.format(output))

@app.route('/Production',methods=['POST'])
def predict3():
    '''
    For rendering results on HTML GUI
    '''
    int_features = [float(x) for x in request.form.values()]
    final_features = [np.array(int_features)]
    prediction = model3.predict(final_features)
    #print(x)

    output = prediction[0]

    return render_template('form3.html', prediction_text3='Production will be of approx  {} quintals'.format(output))

@app.route('/crop',methods=['POST'])
def predict4():
    '''
    For rendering results on HTML GUI
    '''
    int_features = [float(x) for x in request.form.values()]
    final_features = [np.array(int_features)]
    prediction = model4.predict(final_features)
    #print(x)

    output = abs(prediction[0])

    return render_template('form4.html', prediction_text4='Crop Type should be grown is  {}  i.e, for carrot: 1, coconut: 2, cotton: 3, groundnut: 4, melon: 5, millet: 6, potatoes: 7, rice: 8, vegetable: 9, wheat: 10'.format(output))


if __name__ == "__main__":
    app.run(debug=True)
 

