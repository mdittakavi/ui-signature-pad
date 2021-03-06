/*!
 Copyright 2015 ManyWho, Inc.
 Licensed under the ManyWho License, Version 1.0 (the "License"); you may not use this
 file except in compliance with the License.
 You may obtain a copy of the License at: http://manywho.com/sharedsource
 Unless required by applicable law or agreed to in writing, software distributed under
 the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied. See the License for the specific language governing
 permissions and limitations under the License.
 */

(function (manywho) {

    function getStringAttribute(attributes, name) {

        if (attributes != null &&
            attributes[name] != null) {
            return attributes[name];
        }

        return null;

    }

    function getNumberAttribute(attributes, name) {

        if (getStringAttribute(attributes, name) != null) {

            return parseInt(getStringAttribute(attributes, name));

        }

        return 0;

    }

    var signaturePadComponent = React.createClass({

        componentDidMount: function () {

            var id = this.props.id;
            var flowKey = this.props.flowKey;
            var componentFunction = this;

            var model = manywho.model.getComponent(this.props.id, this.props.flowKey);

            // Get the canvas a resize as appropriate by the author
            var canvas = document.getElementById(this.props.id);
            var height = 150;
            var width = 255;

            if (model.width > 0) {
                width = model.width + 'px';
            }

            if (model.height > 0) {
                height = model.height + 'px';
            }

            canvas.width = width;
            canvas.height = height;

            // This references the following library:
            // https://github.com/szimek/signature_pad
            var signaturePad = new SignaturePad(canvas);

            if (getNumberAttribute(model.attributes, 'minWidth') > 0) {
                signaturePad.minWidth = getNumberAttribute(model.attributes, 'minWidth');
            }

            if (getNumberAttribute(model.attributes, 'maxWidth') > 0) {
                signaturePad.maxWidth = getNumberAttribute(model.attributes, 'maxWidth');
            }

            if (getStringAttribute(model.attributes, 'penColor') != null) {
                signaturePad.penColor = getStringAttribute(model.attributes, 'penColor');
            }

            signaturePad.onEnd = function () {

                // do something when the user lifts their finger
                var model = manywho.model.getComponent(id, flowKey);

                manywho.state.setComponent(id, { contentValue: signaturePad.toDataURL() }, flowKey, true);
                manywho.component.handleEvent(componentFunction, model, flowKey);

            };

        },

        render: function () {

            manywho.log.info('Rendering Signature Pad: ' + this.props.id);

            var classes = manywho.styling.getClasses(this.props.parentId, this.props.id, "signature_pad", this.props.flowKey).join(' ');
            var model = manywho.model.getComponent(this.props.id, this.props.flowKey);

            if (model.isVisible == false) {

                classes += ' hidden';

            }

            return React.DOM.canvas({
                id: this.props.id
            });

        }
    });

    manywho.component.register('signature-pad', signaturePadComponent, ['signature_pad']);

}(manywho));