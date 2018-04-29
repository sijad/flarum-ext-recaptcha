<?php

namespace Sijad\ReCaptcha\Listener;

use Illuminate\Contracts\Events\Dispatcher;
use Flarum\Event\PrepareApiAttributes;
use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Settings\SettingsRepositoryInterface;

class AddApiAttributes {
    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    /**
     * @param SettingsRepositoryInterface $settings
     */
    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }

    public function subscribe(Dispatcher $events)
    {
        $events->listen(PrepareApiAttributes::class, [$this, 'prepareApiAttributes']);
    }

    public function prepareApiAttributes(PrepareApiAttributes $event) {
        if ($event->isSerializer(ForumSerializer::class)) {
            $event->attributes['recaptcha'] = [
                'sitekey' => $this->settings->get('sijad-recaptcha.sitekey'),
                'darkTheme' => !! $this->settings->get('theme_dark_mode'),
                'invisible' => !! $this->settings->get('sijad-recaptcha.invisible'),
            ];
        }
    }
}
