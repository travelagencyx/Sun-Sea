
module.exports = {
    registerElement: function(tagName, proto, createdCallback, attachedCallback) {
        var constructor = document.createElement(tagName).constructor;

        if (constructor !== HTMLElement && constructor !== HTMLUnknownElement) {
            // The element is already registered.
            // We must not register it again, because an exception is thrown otherwise.
            // Unknown elements have either HTMLElement or HTMLUnknownElement (Safari) as constructor.

            return constructor;
        }

        return document.registerElement(tagName, {
            prototype: Object.create(proto, {
                createdCallback: { value: createdCallback },
                attachedCallback: { value: attachedCallback }
            })
        });
    }
};