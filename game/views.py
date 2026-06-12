from django.shortcuts import render, redirect
import random

valores_romanos = [
    (1000, "M"), (900, "CM"), (500, "D"), (400, "CD"),
    (100, "C"), (90, "XC"), (50, "L"), (40, "XL"),
    (10, "X"), (9, "IX"), (5, "V"), (4, "IV"), (1, "I")
]

def home(request):
    if request.method == "POST":
        respuesta = request.POST.get("respuesta")
        numero_decimal = request.session.get("numero_decimal")

        if int(respuesta) == numero_decimal:
            #dar correcto. LISTO
            #sumar 1 a "correctos". LISTO
            request.session["mensaje"] = "Correcto!"
            request.session["correctos"] = request.session.get("correctos", 0) + 1
        else:
            request.session["mensaje"] = "Incorrecto!"
            request.session["ultima_respuesta"] = f"Tu respuesta fue {respuesta}"
            request.session["ultimo_romano"] = f"Último romano: {request.session['numero_romano']}"
            request.session["incorrectos"] = request.session.get("incorrectos", 0) + 1
        return redirect("home")
    
    nuevo_numero = random.randint(1, 3999)
    request.session["numero_decimal"] = nuevo_numero
    numero_romano = ""
    for valor, simbolo in valores_romanos:
        while nuevo_numero >= valor:
            numero_romano += simbolo
            nuevo_numero -= valor
    
    request.session["numero_romano"] = numero_romano

    #request.session[""]

    mensaje = request.session.pop("mensaje", "")

    ultima_respuesta = request.session.pop("ultima_respuesta", "")
    ultimo_romano = request.session.pop("ultimo_romano", "")

    context = {
        "numero_romano": numero_romano,
        "mensaje": mensaje,
        "ultima_respuesta": ultima_respuesta,
        "ultimo_romano": ultimo_romano,
        "correctos": request.session.get("correctos", 0),
        "incorrectos": request.session.get("incorrectos", 0)
    }
    
    return render(request, "game/home.html", context)

